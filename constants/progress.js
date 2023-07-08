import { Dimensions, View } from "react-native";

const Progress = ({ totalSteps, currentStep }) => {
  const { width } = Dimensions.get("window");

  const stepWidth = width / totalSteps;

  return (
    <View style={{ width: width }}>
      <View
        style={{
          width: stepWidth * currentStep,
          height: 5,
          backgroundColor: "#e74c3c",
        }}
      />
    </View>
  );
};

export default Progress;
