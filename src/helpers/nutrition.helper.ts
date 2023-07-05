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

  getBMR() {
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

  getTDEE() {
    this.#tdee = this.getBMR() * this.#practiceIndex;

    return parseFloat(this.#tdee.toFixed(2));
  }
}
