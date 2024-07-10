import {useCallback} from 'react';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {isAndroid, isIos} from './constants';

export const usePermissions = typeOfPermission => {
  const getPermission = useCallback(() => {
    // Check if typeOfPermission exists in EPermissionTypes
    if (
      !typeOfPermission ||
      !Object.values(EPermissionTypes).includes(typeOfPermission)
    ) {
      throw new Error('Unsupported Type of permission.');
    }

    // Assuming isIos and isAndroid are defined somewhere in your environment
    if (isIos) {
      switch (typeOfPermission) {
        case EPermissionTypes.CAMERA:
          return PERMISSIONS.IOS.CAMERA;
        default:
          return PERMISSIONS.IOS.CAMERA;
      }
    }

    if (isAndroid) {
      switch (typeOfPermission) {
        case EPermissionTypes.CAMERA:
          return PERMISSIONS.ANDROID.CAMERA;
        default:
          return PERMISSIONS.ANDROID.CAMERA;
      }
    }

    throw new Error('Unsupported Operating System.');
  }, [typeOfPermission]);

  const askPermissions = useCallback(async () => {
    return new Promise((resolve, reject) => {
      // Ask permissions from user
      // If error present, return error
      try {
        request(getPermission()).then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              return reject({
                type: RESULTS.UNAVAILABLE,
              });
            case RESULTS.DENIED:
              return reject({
                type: RESULTS.DENIED,
              });
            case RESULTS.GRANTED:
              return resolve({
                type: RESULTS.GRANTED,
              });
            case RESULTS.BLOCKED:
              return reject({
                type: RESULTS.BLOCKED,
              });
            case RESULTS.LIMITED:
              return resolve({
                type: RESULTS.LIMITED,
              });
            default:
              return reject({
                type: RESULTS.UNAVAILABLE,
              });
          }
        });
      } catch (e) {
        return reject({
          isError: true,
          errorMessage:
            e?.data?.message ||
            e.message ||
            'Something went wrong while asking for permissions.',
        });
      }
    });
  }, [getPermission]);

  return {
    askPermissions,
  };
};

// Enum for permission types
const EPermissionTypes = {
  CAMERA: 'camera',
};

export {EPermissionTypes};
