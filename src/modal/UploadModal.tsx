import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { Colors } from '../comman/comman/Colors';
import FontsSize from '../comman/comman/FontsSize';
import fonts from '../comman/comman/fonts';
import MarginHW from '../comman/comman/MarginHW';

interface UploadModalProps {
    visible: boolean;
    onClose: () => void;
    onImageSelected: (assets: Asset[]) => void;
}

const UploadModal = ({
    visible,
    onClose,
    onImageSelected,
}: UploadModalProps) => {

    const requestCameraPermission = async () => {
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const result = await request(PERMISSIONS.IOS.CAMERA);
            return result === RESULTS.GRANTED;
        }
    };

    const requestGalleryPermission = async () => {
        if (Platform.OS === "android") {
            return true;
        } else {
            const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
            return result === RESULTS.GRANTED;
        }
    };

    const openCamera = async () => {
        onClose(); // Close modal first

        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert("Permission Required", "Camera permission is required");
            return;
        }

        launchCamera({ mediaType: "photo", quality: 0.8 }, response => {
            if (response.assets && response.assets.length > 0) {
                onImageSelected(response.assets);
            }
        });
    };

    const openGallery = async () => {
        onClose(); // Close modal first

        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            Alert.alert("Permission Required", "Gallery permission is required");
            return;
        }

        launchImageLibrary(
            {
                mediaType: "photo",
                quality: 0.8,
                selectionLimit: 0,
            },
            response => {
                if (response.assets && response.assets.length > 0) {
                    onImageSelected(response.assets);
                }
            }
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                onPress={onClose}
                activeOpacity={1}
            >
                {/* Transparent background click to close */}
            </TouchableOpacity>

            <View style={styles.sheet}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Upload Prescription</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.close}>✕</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.sheetItem} onPress={openCamera}>
                    <Text style={styles.sheetText}>📷  Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sheetItem} onPress={openGallery}>
                    <Text style={styles.sheetText}>🖼️  Gallery</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default UploadModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
        backgroundColor: Colors.white,
        padding: MarginHW.MarginH20,
        borderTopLeftRadius: MarginHW.MarginH20,
        borderTopRightRadius: MarginHW.MarginH20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sheetTitle: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
    close: {
        fontSize: FontsSize.size18,
        color: Colors.red,
        fontFamily: fonts.Lexend_SemiBold,
    },
    sheetItem: {
        paddingVertical: MarginHW.MarginH10,
    },
    sheetText: {
        fontSize: FontsSize.size16,
        fontFamily: fonts.Lexend_SemiBold,
        color: Colors.black,
    },
});
