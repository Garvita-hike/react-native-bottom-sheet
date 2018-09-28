# react-native-bottom-sheet


react-native wrapper for android[ BottomSheet](https://material.io/develop/android/components/bottom-sheet-behavior/ " BottomSheet")

>NOTE this is supported only by android as of now.

## Demo

![hEnwsZ](https://i.makeagif.com/media/9-28-2018/hEnwsZ.gif)

## Install

`$ npm install -s react-native-bottom-sheet`

## Usage

You will need to wrap you view in `RNBottomSheet`.

```javascript
	<RNBottomSheet
		style={styles.flexView}
		initialY={initialY}
		ref={(ref) => (this.bottomSheet = Utils.getComponentRef(ref))}
		onDismiss={this.props.hideModal}
		onTopReached={() => { this.setState({scrollEnabled: true}); }}
		isDismissable={true}
		disableSlider={scrollEnabled}
		initialRenderTime={400}
	>
		<TouchableWithoutFeedback onPress={() => {}}>
			<View style = {styles.container}>
				<FlatList
					ref={(node) => this.listRef = node}
					stickyHeaderIndices={[0]}
					onScroll={this._onScroll}
					scrollEnabled={scrollEnabled}
					data={data}
					renderItem={this.getListItem}
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={this.renderHeader}
					keyExtractor={this.keyExtractor}
					removeSubClippedViews={true}
				/>
			</View>
		</TouchableWithoutFeedback>
	</RNBottomSheet>
```

### Props
| Prop  | type  | description | Initial Value |
| :------------ |:-----:| :---------|  :----|
| initialY      | number | Position of bottom sheet view with respect to the window |half of window size|
| isDismissable      | bool        |  Whether to dismiss the bottom sheet on scroll down  | true |
| onDismiss | function        | action to be performed on bottom sheet dismissal ||
| initialRenderTime | number        | inital rendering animation duration | 200 |
| disableSlider | bool        | whether to disable the sliding of bottom sheet ||
| onTopReached | function        | callback when the sheet is dragged to the top of screen ||
| disableDragUp | bool        | disable the drag up action | false|
|style| style props | To specify the container style||
