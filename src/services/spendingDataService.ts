import { CardData, CardSpendingData } from "@/interfaces/wallet";

const generateHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

const generateMonthlySpending = (cardNumber: string) => {
  const hash = generateHash(cardNumber);
  let seed = hash;

  const baseMonthlySpending = seededRandom(seed++, 8000, 15000);

  const foodPercent = seededRandom(seed++, 25, 40);
  const transportPercent = seededRandom(seed++, 20, 35);
  const entertainmentPercent = seededRandom(seed++, 15, 30);
  const utilitiesPercent = seededRandom(seed++, 10, 25);

  const totalPercent =
    foodPercent + transportPercent + entertainmentPercent + utilitiesPercent;
  const normalizedFood = Math.round((foodPercent / totalPercent) * 100);
  const normalizedTransport = Math.round(
    (transportPercent / totalPercent) * 100
  );
  const normalizedEntertainment = Math.round(
    (entertainmentPercent / totalPercent) * 100
  );
  const normalizedUtilities = Math.round(
    (utilitiesPercent / totalPercent) * 100
  );

  return {
    total: baseMonthlySpending,
    categories: {
      food: Math.round((baseMonthlySpending * normalizedFood) / 100),
      transport: Math.round((baseMonthlySpending * normalizedTransport) / 100),
      entertainment: Math.round(
        (baseMonthlySpending * normalizedEntertainment) / 100
      ),
      utilities: Math.round((baseMonthlySpending * normalizedUtilities) / 100),
    },
  };
};

const generateDailySpendingMonthly = (
  cardNumber: string,
  year: number,
  month: number
) => {
  const hash = generateHash(cardNumber);
  let seed = hash + month;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthlyData = generateMonthlySpending(cardNumber);
  const dailyAverage = monthlyData.total / daysInMonth;

  const dailyData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let dailyMultiplier = 1;
    if (isWeekend) {
      dailyMultiplier = seededRandom(seed++, 12, 18) / 10;
    } else {
      dailyMultiplier = seededRandom(seed++, 8, 12) / 10;
    }

    const variation = seededRandom(seed++, 7, 13) / 10;
    const totalDailySpending = Math.round(
      dailyAverage * dailyMultiplier * variation
    );

    const foodPercent = (monthlyData.categories.food / monthlyData.total) * 100;
    const transportPercent =
      (monthlyData.categories.transport / monthlyData.total) * 100;
    const entertainmentPercent =
      (monthlyData.categories.entertainment / monthlyData.total) * 100;
    const utilitiesPercent =
      (monthlyData.categories.utilities / monthlyData.total) * 100;

    dailyData.push({
      date: date.toISOString().split("T")[0],
      total: totalDailySpending,
      categories: {
        food: Math.round((totalDailySpending * foodPercent) / 100),
        transport: Math.round((totalDailySpending * transportPercent) / 100),
        entertainment: Math.round(
          (totalDailySpending * entertainmentPercent) / 100
        ),
        utilities: Math.round((totalDailySpending * utilitiesPercent) / 100),
      },
    });
  }

  return dailyData;
};

const generateDailySpendingYearly = (cardNumber: string, year: number) => {
  const yearlyData = [];
  const hash = generateHash(cardNumber);
  let seed = hash;

  const monthlySpending = generateMonthlySpending(cardNumber);
  const yearlyTotal = monthlySpending.total * 12;
  const dailyAverage = yearlyTotal / 366;

  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Apply day-of-week variations
      let dailyMultiplier = 1;
      if (isWeekend) {
        dailyMultiplier = seededRandom(seed++, 12, 18) / 10;
      } else {
        dailyMultiplier = seededRandom(seed++, 8, 12) / 10;
      }

      if (month === 11) {
        dailyMultiplier *= seededRandom(seed++, 15, 25) / 10;
      } else if (month === 6) {
        dailyMultiplier *= seededRandom(seed++, 12, 18) / 10;
      } else if (month === 2) {
        dailyMultiplier *= seededRandom(seed++, 10, 15) / 10;
      }

      const variation = seededRandom(seed++, 7, 13) / 10;
      let totalDailySpending = Math.round(
        dailyAverage * dailyMultiplier * variation
      );

      const minSpending = Math.round(dailyAverage * 0.3);
      if (totalDailySpending < minSpending) {
        totalDailySpending = minSpending;
      }

      if (date.getDate() === 25 && month === 11) {
        const christmasMultiplier = seededRandom(seed++, 25, 35) / 10;
        totalDailySpending = Math.round(
          totalDailySpending * christmasMultiplier
        );
      } else if (date.getDate() === 1 && month === 0) {
        const newYearMultiplier = seededRandom(seed++, 25, 35) / 10;
        totalDailySpending = Math.round(totalDailySpending * newYearMultiplier);
      } else if (date.getDate() === 14 && month === 1) {
        const valentineMultiplier = seededRandom(seed++, 18, 25) / 10;
        totalDailySpending = Math.round(
          totalDailySpending * valentineMultiplier
        );
      } else if (date.getDate() === 31 && month === 9) {
        const halloweenMultiplier = seededRandom(seed++, 15, 22) / 10;
        totalDailySpending = Math.round(
          totalDailySpending * halloweenMultiplier
        );
      }

      const foodPercent =
        (monthlySpending.categories.food / monthlySpending.total) * 100;
      const transportPercent =
        (monthlySpending.categories.transport / monthlySpending.total) * 100;
      const entertainmentPercent =
        (monthlySpending.categories.entertainment / monthlySpending.total) *
        100;
      const utilitiesPercent =
        (monthlySpending.categories.utilities / monthlySpending.total) * 100;

      yearlyData.push({
        date: dateKey,
        total: totalDailySpending,
        categories: {
          food: Math.round((totalDailySpending * foodPercent) / 100),
          transport: Math.round((totalDailySpending * transportPercent) / 100),
          entertainment: Math.round(
            (totalDailySpending * entertainmentPercent) / 100
          ),
          utilities: Math.round((totalDailySpending * utilitiesPercent) / 100),
        },
      });
    }
  }

  return yearlyData;
};

export const generateCardSpendingData = (card: CardData): CardSpendingData => {
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const originalCardNumber = card.number;
  const cardNumber =
    card.number.length >= 4 ? `**** ${card.number.slice(-4)}` : card.number;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthlySpending = generateMonthlySpending(originalCardNumber);
  const dailySpendingMonthly = generateDailySpendingMonthly(
    originalCardNumber,
    currentYear,
    currentMonth
  );
  const dailySpendingYearly = generateDailySpendingYearly(
    originalCardNumber,
    currentYear
  );

  return {
    cardId,
    cardNumber,
    monthlySpending,
    dailySpending: {
      monthly: dailySpendingMonthly,
      yearly: dailySpendingYearly,
    },
    isActive: true,
  };
};

export const updateSpendingData = (cards: CardData[]): CardSpendingData[] => {
  const existingData =
    typeof window !== "undefined"
      ? localStorage.getItem("card_spending_data")
      : null;
  let existingSpendingData: CardSpendingData[] = [];

  if (existingData) {
    try {
      existingSpendingData = JSON.parse(existingData);
    } catch {}
  }

  const updatedSpendingData: CardSpendingData[] = [];

  cards.forEach((card) => {
    if (!card.number || card.number.trim() === "") return;

    const originalCardNumber = card.number;
    const formattedCardNumber =
      card.number.length >= 4 ? `**** ${card.number.slice(-4)}` : card.number;

    const existingCardData = existingSpendingData.find((data) => {
      if (data.cardNumber === formattedCardNumber) {
        return true;
      }
      const existingOriginal = data.cardNumber.replace("**** ", "");
      return existingOriginal === originalCardNumber;
    });

    if (existingCardData) {
      updatedSpendingData.push({
        ...existingCardData,
        cardNumber: formattedCardNumber,
        isActive: true,
      });
    } else {
      const newSpendingData = generateCardSpendingData(card);
      updatedSpendingData.push(newSpendingData);
    }
  });

  existingSpendingData.forEach((existingData) => {
    const isStillInWallet = cards.some((card) => {
      const originalCardNumber = card.number;
      const formattedCardNumber =
        card.number.length >= 4 ? `**** ${card.number.slice(-4)}` : card.number;

      return (
        existingData.cardNumber === formattedCardNumber ||
        existingData.cardNumber.replace("**** ", "") === originalCardNumber
      );
    });

    if (!isStillInWallet) {
      updatedSpendingData.push({
        ...existingData,
        isActive: false,
      });
    }
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(
      "card_spending_data",
      JSON.stringify(updatedSpendingData)
    );
  }

  return updatedSpendingData;
};

export const getCurrentActiveCard = (
  spendingData: CardSpendingData[]
): CardSpendingData | null => {
  const activeCards = spendingData.filter((data) => data.isActive);
  return activeCards.length > 0 ? activeCards[0] : null;
};

export const calculateAggregatedData = (spendingData: CardSpendingData[]) => {
  const activeCards = spendingData.filter((data) => data.isActive);

  if (activeCards.length === 0) {
    return {
      totalSpending: 0,
      monthlySpending: 0,
      dailySpending: [],
    };
  }

  const totalSpending = activeCards.reduce(
    (sum, card) => sum + card.monthlySpending.total,
    0
  );
  const monthlySpending = totalSpending;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const dailySpendingMap = new Map<string, number>();

  activeCards.forEach((card) => {
    card.dailySpending.monthly.forEach((dayData) => {
      const date = new Date(dayData.date);
      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        const dateKey = dayData.date;
        dailySpendingMap.set(
          dateKey,
          (dailySpendingMap.get(dateKey) || 0) + dayData.total
        );
      }
    });
  });

  const dailySpending = Array.from(dailySpendingMap.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalSpending,
    monthlySpending,
    dailySpending,
  };
};
