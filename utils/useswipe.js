import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

function useSwipe(actionRight, rangeOffset = 5) {
	let firstTouch = 0;

	function onTouchStart(event) {
		firstTouch = event.nativeEvent.touches[0].pageX;
		console.log(firstTouch);
	}

	function onTouchEnd(event) {
		const positionX = event.nativeEvent.changedTouches[0].pageX;
		const range = windowWidth / rangeOffset;

		if (positionX - firstTouch > range) {
			actionRight && actionRight();
		}
		firstTouch = 0;
	}

	return { onTouchStart, onTouchEnd };
}

export default useSwipe;
