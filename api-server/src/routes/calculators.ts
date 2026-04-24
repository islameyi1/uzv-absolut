import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  CalcPoolVolumeBody,
  CalcDrumFilterBody,
  CalcPumpBody,
  CalcCompressorBody,
  CalcOxygenBody,
  SaveChecklistBody,
} from "@workspace/api-zod";

const router: Router = Router();

// In-memory checklist state (per user would be better but this works for demo)
const checklistState: Record<string, boolean> = {};

const defaultChecklist = [
  { id: "pump-main", category: "Насосное оборудование", name: "Главный насос рециркуляции", description: "Насос для рециркуляции воды в системе УЗВ", required: true },
  { id: "pump-backup", category: "Насосное оборудование", name: "Резервный насос", description: "Резервный насос на случай отказа основного", required: true },
  { id: "drum-filter", category: "Фильтрация", name: "Барабанный фильтр", description: "Механическая фильтрация твёрдых частиц", required: true },
  { id: "biofilter", category: "Фильтрация", name: "Биологический фильтр", description: "Биологическая очистка воды от аммиака и нитритов", required: true },
  { id: "uv-sterilizer", category: "Очистка", name: "УФ-стерилизатор", description: "Обеззараживание воды ультрафиолетом", required: true },
  { id: "oxygen-conc", category: "Аэрация", name: "Кислородный концентратор", description: "Насыщение воды кислородом", required: true },
  { id: "compressor", category: "Аэрация", name: "Компрессор", description: "Подача воздуха в бассейны", required: false },
  { id: "degasser", category: "Газоудаление", name: "Дегазатор СО₂", description: "Удаление углекислого газа из воды", required: true },
  { id: "heater", category: "Температурный контроль", name: "Нагреватель воды", description: "Поддержание оптимальной температуры", required: true },
  { id: "chiller", category: "Температурный контроль", name: "Чиллер", description: "Охлаждение воды при необходимости", required: false },
  { id: "ph-sensor", category: "Мониторинг", name: "Датчик pH", description: "Автоматический контроль уровня pH", required: true },
  { id: "o2-sensor", category: "Мониторинг", name: "Датчик кислорода", description: "Непрерывный мониторинг содержания O₂", required: true },
  { id: "temp-sensor", category: "Мониторинг", name: "Датчик температуры", description: "Контроль температуры воды", required: true },
  { id: "alarm-system", category: "Безопасность", name: "Система аварийного оповещения", description: "SMS/звуковые оповещения при нештатных ситуациях", required: true },
  { id: "backup-power", category: "Безопасность", name: "Резервное электропитание", description: "ДГУ или ИБП для аварийного питания", required: true },
  { id: "feeding-auto", category: "Кормление", name: "Автокормушки", description: "Автоматическое кормление рыбы по расписанию", required: false },
];

router.post("/calculators/pool-volume", requireAuth, async (req, res): Promise<void> => {
  const parsed = CalcPoolVolumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { shape, length, width, diameter, depth } = parsed.data;
  let volume = 0;
  let formula = "";

  if (shape === "rectangular" && length && width) {
    volume = length * width * depth;
    formula = `${length} × ${width} × ${depth} = ${volume.toFixed(2)} м³`;
  } else if (shape === "circular" && diameter) {
    volume = Math.PI * (diameter / 2) ** 2 * depth;
    formula = `π × (${diameter}/2)² × ${depth} = ${volume.toFixed(2)} м³`;
  } else if (shape === "oval" && length && width) {
    volume = Math.PI * (length / 2) * (width / 2) * depth;
    formula = `π × (${length}/2) × (${width}/2) × ${depth} = ${volume.toFixed(2)} м³`;
  } else {
    res.status(400).json({ error: "Недостаточно данных для расчёта объёма" });
    return;
  }

  res.json({
    result: parseFloat(volume.toFixed(3)),
    unit: "м³",
    details: { formula, shape, depth },
    recommendations: [
      `Объём бассейна: ${volume.toFixed(2)} м³`,
      `Площадь поверхности: ${(volume / depth).toFixed(2)} м²`,
      `Рекомендуемая плотность посадки: ${(volume * 30).toFixed(0)} кг рыбы`,
    ],
  });
});

router.post("/calculators/drum-filter", requireAuth, async (req, res): Promise<void> => {
  const parsed = CalcDrumFilterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { poolVolume, fishBiomass, feedRate } = parsed.data;
  // TSS loading: ~0.25 kg TSS per kg feed
  const tssPerHour = (feedRate / 24) * 0.25;
  // Filter capacity needed (m³/h), considering recirculation rate (typ. 1-2 volumes/hour)
  const flowRate = poolVolume * 1.5;
  // Recommended filter size based on TSS and flow
  const filterPerformance = flowRate * 1000; // L/h

  res.json({
    result: parseFloat(flowRate.toFixed(2)),
    unit: "м³/ч",
    details: {
      tssPerHour: tssPerHour.toFixed(3),
      flowRate: flowRate.toFixed(2),
      filterPerformance: filterPerformance.toFixed(0),
    },
    recommendations: [
      `Расход воды через фильтр: ${flowRate.toFixed(2)} м³/ч`,
      `Нагрузка по ВВ: ${tssPerHour.toFixed(3)} кг/ч`,
      `Производительность фильтра: ${filterPerformance.toFixed(0)} л/ч`,
      `Рекомендуемая ячейка сетки: ${fishBiomass < 50 ? "60" : fishBiomass < 200 ? "90" : "120"} мкм`,
    ],
  });
});

router.post("/calculators/pump", requireAuth, async (req, res): Promise<void> => {
  const parsed = CalcPumpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { poolVolume, turnoverRate, headHeight } = parsed.data;
  const flowRate = poolVolume * turnoverRate;
  // Power (W) = Q (m³/h) * H (m) * ρg / (3600 * η)
  const efficiency = 0.7;
  const powerKW = (flowRate * headHeight * 1000 * 9.81) / (3600 * 1000 * efficiency);

  res.json({
    result: parseFloat(powerKW.toFixed(3)),
    unit: "кВт",
    details: {
      flowRate: flowRate.toFixed(2),
      headHeight,
      efficiency: `${(efficiency * 100).toFixed(0)}%`,
    },
    recommendations: [
      `Расход насоса: ${flowRate.toFixed(2)} м³/ч`,
      `Мощность насоса: ${powerKW.toFixed(3)} кВт`,
      `Суточное потребление: ${(powerKW * 24).toFixed(2)} кВт·ч`,
      `Рекомендуемый запас мощности: ${(powerKW * 1.25).toFixed(3)} кВт`,
    ],
  });
});

router.post("/calculators/compressor", requireAuth, async (req, res): Promise<void> => {
  const parsed = CalcCompressorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { poolVolume, fishBiomass, waterTemperature } = parsed.data;
  // Oxygen demand increases with temperature
  const tempFactor = 1 + (waterTemperature - 20) * 0.05;
  // Base air demand: ~50 L/min per 1000L of water
  const baseAirDemand = (poolVolume * 1000 * 50) / 1000; // L/min
  // Additional for fish biomass: ~1.5 L/min per kg of fish
  const fishAirDemand = fishBiomass * 1.5;
  const totalAirDemand = (baseAirDemand + fishAirDemand) * tempFactor;
  const compressorPower = totalAirDemand * 0.015; // kW, approx

  res.json({
    result: parseFloat(totalAirDemand.toFixed(2)),
    unit: "л/мин",
    details: {
      baseAirDemand: baseAirDemand.toFixed(2),
      fishAirDemand: fishAirDemand.toFixed(2),
      tempFactor: tempFactor.toFixed(2),
      compressorPower: compressorPower.toFixed(2),
    },
    recommendations: [
      `Общий расход воздуха: ${totalAirDemand.toFixed(2)} л/мин`,
      `Мощность компрессора: ~${compressorPower.toFixed(2)} кВт`,
      `Давление: минимум 0.3–0.5 бар`,
      `Рекомендуемый запас: ${(totalAirDemand * 1.3).toFixed(2)} л/мин (+30%)`,
    ],
  });
});

router.post("/calculators/oxygen", requireAuth, async (req, res): Promise<void> => {
  const parsed = CalcOxygenBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { poolVolume, fishBiomass, targetOxygen, currentOxygen } = parsed.data;
  // O2 demand by fish: ~250 mg O2 per kg/hour at 20°C
  const fishO2Demand = fishBiomass * 250; // mg/h
  // O2 needed to raise level in pool
  const o2ToAdd = (targetOxygen - currentOxygen) * poolVolume * 1000; // mg
  // Concentrator output: g/h -> typical units
  const concentratorOutput = (fishO2Demand + o2ToAdd / 24) / 1000; // g/h -> approx kg/day

  res.json({
    result: parseFloat(concentratorOutput.toFixed(3)),
    unit: "г/ч",
    details: {
      fishO2Demand: fishO2Demand.toFixed(0),
      o2ToAdd: o2ToAdd.toFixed(0),
      targetOxygen,
      currentOxygen,
    },
    recommendations: [
      `Потребление кислорода рыбой: ${fishO2Demand.toFixed(0)} мг/ч`,
      `Производительность концентратора: ${concentratorOutput.toFixed(3)} г/ч`,
      `Ожидаемое время насыщения: ${(o2ToAdd / (concentratorOutput * 1000)).toFixed(1)} ч`,
      `Рекомендуемый запас: ${(concentratorOutput * 1.2).toFixed(3)} г/ч`,
    ],
  });
});

router.get("/calculators/checklist", requireAuth, async (req, res): Promise<void> => {
  const items = defaultChecklist.map((item) => ({
    ...item,
    completed: checklistState[`${req.userId}-${item.id}`] ?? false,
  }));
  res.json(items);
});

router.post("/calculators/checklist", requireAuth, async (req, res): Promise<void> => {
  const parsed = SaveChecklistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  for (const item of parsed.data) {
    checklistState[`${req.userId}-${item.id}`] = item.completed;
  }
  res.json({ success: true });
});

export default router;
