import { v2 } from 'cloudinary';

const uploadImage = async (image: string): Promise<any> => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    const result = await v2.uploader.upload(image, options);
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function upload(image: string): Promise<string> {
  v2.config({
    secure: true,
    api_key: '649737161179275',
    cloud_name: 'du4eeagji',
    api_secret: 'VCHwxR-nWh97rxLAtmRViDpd48Y',
  });

  console.log(v2.config());
  console.log('entro a subir a cloudinary');

  try {
    const res = await uploadImage(image);
    const url = res.url;
    console.log(res, 'aca estaria el problema ?');
    return url;
  } catch (error) {
    console.error(`Error al subir la imagen a Cloudinary: ${error.message}`);
    throw error;
  }
}

export default upload;
