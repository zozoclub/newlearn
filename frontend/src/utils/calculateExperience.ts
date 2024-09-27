type ExperienceType = {
  level: number;
  percentage: number;
  experience: number;
};

const levelTable: { level: number; required: number }[] = [];
let requiredExp = 100;

for (let level = 1; level <= 100; level++) {
  levelTable.push({ level, required: Math.round(requiredExp) });
  requiredExp *= 1.05; // 5% increase
}

export const calculateExperience = (experience: number): ExperienceType => {
  let totalExpForCurrentLevel = 0;

  for (let i = 0; i < levelTable.length; i++) {
    const currentLevelExp = levelTable[i].required;

    if (experience < totalExpForCurrentLevel + currentLevelExp) {
      const expInCurrentLevel = experience - totalExpForCurrentLevel;
      const percentage = (expInCurrentLevel / currentLevelExp) * 100;

      return {
        level: levelTable[i].level,
        percentage: Math.floor(percentage),
        experience: expInCurrentLevel,
      };
    }

    totalExpForCurrentLevel += currentLevelExp;
  }

  // If experience exceeds the highest level
  const lastLevel = levelTable[levelTable.length - 1];
  return {
    level: lastLevel.level,
    percentage: 100,
    experience: experience - totalExpForCurrentLevel,
  };
};
