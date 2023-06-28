export const RESPONSE_MESSAGES = Object.freeze({
  LOGIN: {
    SUCCESS: 'Login successful',
    ERROR: 'Login failed',
  },
  REGISTER: {
    SUCCESS: 'Register successful',
    ERROR: 'Register failed',
  },
  USER: {
    GET_USER_SUCCESS: 'Get user successful',
    GET_USER_ERROR: 'Get user error',
    GET_PROFILE_SUCCESS: 'Get profile successful',
    GET_PROFILE_ERROR: 'Get profile error',
    UPDATE_PROFILE_SUCCESS: 'Update profile successful',
    UPDATE_PROFILE_ERROR: 'Update profile error',
    EMAIL_EXIST: 'Email already exist',
  },
  RECIPE: {
    GET_RECIPE_SUCCESS: 'Get recipe successful',
    GET_RECIPE_ERROR: 'Get recipe error',
    READY_TO_COOK: 'Ready to cook',
    CAN_NOT_COOK: 'Can not cook this recipe',
    RECOMMEND_FAILED: 'Recommend failed',
    RECOMMEND_SUCCESS: 'Recommend successful',
  },
  INGREDIENT: {
    GET_INGREDIENT_SUCCESS: 'Get ingredient successful',
    GET_INGREDIENT_ERROR: 'Get ingredient error',
  },
  RECIPE_RATING: {
    RATING_SUCCESS: 'Rating successful',
    RATING_ERROR: 'Rating error',
  },
});
