import BaseRepository from '@client/api/base-repository';

const resource = '/file';

export default {
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return BaseRepository.post(`${resource}/upload`, formData);
  },
};
