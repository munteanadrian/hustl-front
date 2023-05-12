import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import { Stack, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";

import BuildImage from "./../assets/onboarding/build";
import GoalsImage from "./../assets/onboarding/goals";
import MotivationImage from "./../assets/onboarding/motivation";
import NetworkImage from "./../assets/onboarding/network";

const Card = ({ image, title, subtitle, index }) => {
  return (
    <View className="flex flex-col h-fit justify-around items-center gap-y-4">
      {image === "build" ? (
        <BuildImage width="60%" height="40%" />
      ) : image === "goals" ? (
        <GoalsImage width="60%" height="40%" />
      ) : image === "motivated" ? (
        <MotivationImage width="60%" height="40%" />
      ) : (
        <NetworkImage width="60%" height="40%" />
      )}

      <Text className="text-2xl font-bold text-center text-midnight">
        {title}
      </Text>
      <Text className="text-base font-light text-wetAsphalt max-w-prose text-center leading-6 tracking-wider">
        {subtitle}
      </Text>
    </View>
  );
};

const Onboarding = () => {
  const router = useRouter();

  // Screen size
  const { height, width } = Dimensions.get("window");

  // For the onboarding cards
  const cards = [
    {
      image: "build",
      title: "Build your network",
      subtitle:
        "Connect with people who share your professional interests and grow your network to boost your career prospects.",
      index: 0,
    },
    {
      image: "goals",
      title: "Reach your goals",
      subtitle:
        "Set achievable goals for yourself and get support from peers who can help you stay motivated and on track",
      index: 1,
    },
    {
      image: "motivated",
      title: "Keep motivated",
      subtitle:
        "Never stop learning and growing by seeking guidance and feedback from others who share your passion for personal development.",
      index: 2,
    },
    {
      image: "network",
      title: "Enhance your skills",
      subtitle:
        "Develop new skills and enhance your existing ones with the help of a supportive community that values continuous learning and improvement.",
      index: 3,
    },
  ];

  //
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef(null);

  // change every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      carouselRef.current.snapToNext();
      setActiveCard((activeCard + 1) % cards.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeCard]);

  // render the card
  const renderCarouselCards = ({ item }) => {
    return (
      <Card image={item.image} title={item.title} subtitle={item.subtitle} />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, width: width }}>
      <View className="flex-1 items-center justify-center bg-white px-10">
        <Carousel
          ref={carouselRef}
          data={cards}
          renderItem={renderCarouselCards}
          onSnapToItem={(index) => setActiveCard(index)}
          snapToInterval={width * 0.8}
          loop={true}
          itemWidth={width * 0.8}
          sliderWidth={width * 0.8}
          containerCustomStyle={{
            marginTop: 10,
            flexGrow: 0,
            height: height * 0.4,
          }}
        />

        <Pagination
          carouselRef={carouselRef}
          dotsLength={cards.length}
          dotColor="#2c3e50"
          inactiveDotColor="#95a5a6"
          activeDotIndex={activeCard}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
            backgroundColor: "rgba(44, 62, 80,1.0)",
          }}
          inactiveDotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />

        {/* button */}
        <View className="mt-10 items-center">
          <TouchableOpacity
            style={{ width: width * 0.9 }}
            className="bg-alizarin rounded-full"
            onPress={() => {
              router.push("signup");
            }}
          >
            <Text className="text-white py-4 font-bold text-lg text-center">
              Create an account
            </Text>
          </TouchableOpacity>

          <View className="flex-row mt-5 gap-x-2 items-center">
            <Text className="text-sm font-normal">
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => {
                router.push("login");
              }}
            >
              <Text className="text-alizarin font-bold text-center">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-10 absolute bottom-5">
          <Text className="text-concrete text-xs">Version 0.0.1</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
