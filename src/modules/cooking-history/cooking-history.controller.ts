import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CookingHistoryService } from './cooking-history.service';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('cooking-histories')
@Controller('cooking-histories')
export class CookingHistoryController {
  constructor(private readonly cookingHistoryService: CookingHistoryService) {}

  @Get('recipes-statistics')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async getRecipesStatistics(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() response,
  ) {
    try {
      const data = await this.cookingHistoryService.getRecipesStatistics(
        from,
        to,
      );

      return new ResponseSuccess(
        RESPONSE_MESSAGES.COOKING_HISTORY.GET_STATISTICS_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.COOKING_HISTORY.GET_STATISTICS_ERROR,
        error,
      ).sendResponse(response);
    }
  }
}
