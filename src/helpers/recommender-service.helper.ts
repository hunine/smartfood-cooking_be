import { RECOMMENDER_SERVICE } from '@config/env';
import { HttpHelper } from './http.helper';

export class RecommenderServiceHelper {
  static async training() {
    const url = `${RECOMMENDER_SERVICE.URL}/recommend/training`;
    const result: any = await HttpHelper.post(url, {}, null, {
      headers: {
        authorization: RECOMMENDER_SERVICE.API_KEY,
      },
    });

    return result;
  }
}
