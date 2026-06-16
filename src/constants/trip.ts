export enum TripStatus {
  PLANNING = 'planning',
  ONGOING = 'ongoing',
  FINISHED = 'finished',
}
export const TRIP_STATUS_OPTIONS = [
  { label: '规划中', value: TripStatus.PLANNING },
  { label: '进行中', value: TripStatus.ONGOING },
  { label: '已结束', value: TripStatus.FINISHED },
];
export const DEFAULT_COVER_GALLERY = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sunset%20over%20tropical%20beach%20with%20palm%20trees%20vacation&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20temple%20mountain%20landscape%20misty%20scenic&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20european%20city%20street%20cafe%20travel%20summer&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=snow%20mountain%20peak%20alpine%20adventure%20hiking&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=japanese%20cherry%20blossom%20spring%20park%20pink%20beautiful&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=desert%20sand%20dunes%20sunrise%20camel%20adventure%20safari&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=northern%20lights%20aurora%20borealis%20night%20sky%20iceland&image_size=landscape_16_9',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tokyo%20city%20skyline%20night%20neon%20lights%20urban&image_size=landscape_16_9',
];

