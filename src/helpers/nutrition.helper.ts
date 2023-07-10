import {
  CALORIES_PER_CARBS,
  CALORIES_PER_FAT,
  CALORIES_PER_PROTEIN,
} from 'src/common/constants';
import { Gender } from 'src/common/enums/gender.enum';
import {
  PracticeMode,
  PracticeModeLabel,
} from 'src/common/enums/practice-mode.enum';

export class NutritionHelper {
  #height: number;
  #weight: number;
  #age: number;
  #gender: Gender;
  #bmr: number;
  #tdee: number;
  #practiceIndex: PracticeMode;

  constructor(height, weight, age, gender, practiceMode: PracticeModeLabel) {
    this.#height = height;
    this.#weight = weight;
    this.#age = age;
    this.#gender = gender;
    this.#practiceIndex = PracticeMode[practiceMode];
  }

  private getBMR() {
    if (this.#gender === Gender.MALE) {
      this.#bmr =
        13.397 * this.#weight +
        4.799 * this.#height -
        5.677 * this.#age +
        88.362;
    } else {
      this.#bmr =
        9.247 * this.#weight +
        3.098 * this.#height -
        4.33 * this.#age +
        447.593;
    }

    return this.#bmr;
  }

  private getCarbs(calories: number) {
    return parseFloat(((0.35 * calories) / CALORIES_PER_CARBS).toFixed(2));
  }

  private getProtein(calories: number) {
    return parseFloat(((0.3 * calories) / CALORIES_PER_PROTEIN).toFixed(2));
  }

  private getFat(calories: number) {
    return parseFloat(((0.35 * calories) / CALORIES_PER_FAT).toFixed(2));
  }

  private getTotalCalories() {
    this.#tdee = this.getBMR() * this.#practiceIndex;

    return parseFloat(this.#tdee.toFixed(2));
  }

  getNutrition() {
    const calories = this.getTotalCalories();

    return {
      calories,
      carbs: this.getCarbs(calories),
      protein: this.getProtein(calories),
      fat: this.getFat(calories),
    };
  }

  static calculateNutritionByWeight(
    { kcal, carbs, protein, fat },
    weight: number,
  ) {
    return {
      kcal: parseFloat(((kcal * weight) / 100).toFixed(2)),
      carbs: parseFloat(((carbs * weight) / 100).toFixed(2)),
      protein: parseFloat(((protein * weight) / 100).toFixed(2)),
      fat: parseFloat(((fat * weight) / 100).toFixed(2)),
    };
  }
}
