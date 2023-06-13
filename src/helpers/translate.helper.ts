import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator';

export default class TranslateHelper {
  private languageIn: string;
  private languageOut: string;
  private translator: GoogleTranslator;

  constructor(languageIn, languageOut) {
    this.languageIn = languageIn;
    this.languageOut = languageOut;

    this.translator = new GoogleTranslator({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
      },
    });
  }

  async translate(text = '') {
    return this.translator.translate(text, this.languageIn, this.languageOut);
  }
}
