import { webhook } from '../config.discord-webhook';
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { MessageBuilder } from 'discord-webhook-node';
import * as process from 'process';

@Injectable()
export class UploadRepository {
  /**
   base64로 인코딩된 이미지를 S3에 업로드합니다.
   @param path S3에 업로드할 경로
   @param fileName S3에 업로드할 파일 이름
   @param base64 base64로 인코딩된 이미지
   */
  async uploadBase64(path: string, fileName: string, base64: string) {
    if (base64 === undefined) {
      return 'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png';
    }

    const base64Data = Buffer.from(base64, 'base64');
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const imagePath = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}/${fileName}`;
      await webhook.info(`Uploading ${path}/${fileName}`);
      await new AWS.S3()
        .putObject({
          Key: `${path}/${fileName}`,
          Body: base64Data,
          Bucket: process.env.AWS_S3_BUCKET_NAME,
        })
        .promise();

      const embed = new MessageBuilder().setImage(imagePath);
      await webhook.send(embed);

      return imagePath;
    } catch (error) {
      throw Error('이미지 업로드에 실패했습니다.');
    }
  }
}
