import { CardData, CardSpendingData } from "@/interfaces/wallet";

// Generate a consistent hash from card number for seeded random generation
const generateHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Seeded random number generator
const seededRandom = (seed: number, min: number, max: number): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

// Generate monthly spending data for a card
const generateMonthlySpending = (cardNumber: string) => {
  const hash = generateHash(cardNumber);
  let seed = hash;

  // Generate base monthly spending amount
  const baseMonthlySpending = seededRandom(seed++, 8000, 15000);

  // Generate category percentages that sum to 100
  const foodPercent = seededRandom(seed++, 25, 40);
  const transportPercent = seededRandom(seed++, 20, 35);
  const entertainmentPercent = seededRandom(seed++, 15, 30);
  const utilitiesPercent = seededRandom(seed++, 10, 25);

  // Normalize percentages to sum to 100
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

// Generate daily spending data for a month
const generateDailySpendingMonthly = (
  cardNumber: string,
  year: number,
  month: number
) => {
  const hash = generateHash(cardNumber);
  let seed = hash + month; // Vary seed by month for different patterns

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthlyData = generateMonthlySpending(cardNumber);
  const dailyAverage = monthlyData.total / daysInMonth;

  const dailyData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Apply day-of-week variations
    let dailyMultiplier = 1;
    if (isWeekend) {
      dailyMultiplier = seededRandom(seed++, 12, 18) / 10; // 1.2-1.8x on weekends
    } else {
      dailyMultiplier = seededRandom(seed++, 8, 12) / 10; // 0.8-1.2x on weekdays
    }

    // Apply random variation
    const variation = seededRandom(seed++, 7, 13) / 10; // ±30% variation
    const totalDailySpending = Math.round(
      dailyAverage * dailyMultiplier * variation
    );

    // Distribute across categories based on monthly percentages
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

// Generate daily spending data for a year
const generateDailySpendingYearly = (cardNumber: string, year: number) => {
  const yearlyData = [];
  const hash = generateHash(cardNumber);
  let seed = hash;

  // Generate base monthly spending for the year
  const monthlySpending = generateMonthlySpending(cardNumber);
  const yearlyTotal = monthlySpending.total * 12;
  const dailyAverage = yearlyTotal / 366; // 2024 is a leap year

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
        dailyMultiplier = seededRandom(seed++, 12, 18) / 10; // 1.2-1.8x on weekends
      } else {
        dailyMultiplier = seededRandom(seed++, 8, 12) / 10; // 0.8-1.2x on weekdays
      }

      // Apply monthly variations
      if (month === 11) {
        // December - holiday season
        dailyMultiplier *= seededRandom(seed++, 15, 25) / 10; // 1.5-2.5x
      } else if (month === 6) {
        // July - summer
        dailyMultiplier *= seededRandom(seed++, 12, 18) / 10; // 1.2-1.8x
      } else if (month === 2) {
        // March - spring
        dailyMultiplier *= seededRandom(seed++, 10, 15) / 10; // 1.0-1.5x
      }

      // Add random variations (±30% for more realistic spread)
      const variation = seededRandom(seed++, 7, 13) / 10; // 0.7 to 1.3
      let totalDailySpending = Math.round(
        dailyAverage * dailyMultiplier * variation
      );

      // Ensure minimum spending for every day (no zero days)
      const minSpending = Math.round(dailyAverage * 0.3); // At least 30% of average
      if (totalDailySpending < minSpending) {
        totalDailySpending = minSpending;
      }

      // Add some special event days with higher spending
      if (date.getDate() === 25 && month === 11) {
        // Christmas - very high spending
        const christmasMultiplier = seededRandom(seed++, 25, 35) / 10; // 2.5-3.5x
        totalDailySpending = Math.round(
          totalDailySpending * christmasMultiplier
        );
      } else if (date.getDate() === 1 && month === 0) {
        // New Year - very high spending
        const newYearMultiplier = seededRandom(seed++, 25, 35) / 10; // 2.5-3.5x
        totalDailySpending = Math.round(totalDailySpending * newYearMultiplier);
      } else if (date.getDate() === 14 && month === 1) {
        // Valentine's Day - high spending
        const valentineMultiplier = seededRandom(seed++, 18, 25) / 10; // 1.8-2.5x
        totalDailySpending = Math.round(
          totalDailySpending * valentineMultiplier
        );
      } else if (date.getDate() === 31 && month === 9) {
        // Halloween - moderate spending
        const halloweenMultiplier = seededRandom(seed++, 15, 22) / 10; // 1.5-2.2x
        totalDailySpending = Math.round(
          totalDailySpending * halloweenMultiplier
        );
      }

      // Distribute across categories based on monthly percentages
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

// Generate spending data for a new card
export const generateCardSpendingData = (card: CardData): CardSpendingData => {
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  // Use the original card number for data generation, but store formatted version for display
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

// Update spending data when cards change
export const updateSpendingData = (cards: CardData[]): CardSpendingData[] => {
  const existingData = localStorage.getItem("card_spending_data");
  let existingSpendingData: CardSpendingData[] = [];

  if (existingData) {
    try {
      existingSpendingData = JSON.parse(existingData);
    } catch {
      // Error parsing existing spending data
    }
  }

  const updatedSpendingData: CardSpendingData[] = [];

  cards.forEach((card) => {
    if (!card.number || card.number.trim() === "") return;

    const originalCardNumber = card.number;
    const formattedCardNumber =
      card.number.length >= 4 ? `**** ${card.number.slice(-4)}` : card.number;

    // Check if spending data already exists for this card by matching original numbers
    const existingCardData = existingSpendingData.find((data) => {
      // Try to match by formatted card number first
      if (data.cardNumber === formattedCardNumber) {
        return true;
      }
      // Fallback: try to match by extracting original number from formatted
      const existingOriginal = data.cardNumber.replace("**** ", "");
      return existingOriginal === originalCardNumber;
    });

    if (existingCardData) {
      // Keep existing data but ensure it's active and has correct formatted number
      updatedSpendingData.push({
        ...existingCardData,
        cardNumber: formattedCardNumber, // Ensure consistent formatting
        isActive: true,
      });
    } else {
      // Generate new spending data
      const newSpendingData = generateCardSpendingData(card);
      updatedSpendingData.push(newSpendingData);
    }
  });

  // Mark cards that are no longer in the wallet as inactive
  existingSpendingData.forEach((existingData) => {
    const isStillInWallet = cards.some((card) => {
      const originalCardNumber = card.number;
      const formattedCardNumber =
        card.number.length >= 4 ? `**** ${card.number.slice(-4)}` : card.number;

      // Check if this card is still in the wallet
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

  // Save to localStorage
  localStorage.setItem(
    "card_spending_data",
    JSON.stringify(updatedSpendingData)
  );

  return updatedSpendingData;
};

// Get current active card
export const getCurrentActiveCard = (
  spendingData: CardSpendingData[]
): CardSpendingData | null => {
  const activeCards = spendingData.filter((data) => data.isActive);
  return activeCards.length > 0 ? activeCards[0] : null;
};

// Calculate aggregated data across all active cards
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

  // Aggregate daily spending for the current month
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
