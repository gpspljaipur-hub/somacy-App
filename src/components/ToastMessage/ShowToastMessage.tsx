import Toast from 'react-native-root-toast'

const showToast = async (msg: string, position?: any) => {
  Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: position ?? Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    containerStyle: { backgroundColor: 'rgba(0,0,0,0.7)', width: '70%' }
  })
}

export default { showToast }