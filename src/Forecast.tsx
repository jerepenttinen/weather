// @ts-ignore
import { API_KEY } from "@env";
import { useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, Text, Image, View } from "react-native";

import { useStore } from "./store";

type Resp = {
  cnt: number;
  list: IForecast[];
};

type IForecast = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
};

function Item({ forecast }: { forecast: ListRenderItemInfo<IForecast> }) {
  const dt = new Date(forecast.item.dt * 1000);
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 10,
        marginHorizontal: 20,
      }}
    >
      <Text>
        {dt.toLocaleDateString()} {dt.toLocaleTimeString()}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{
              elevation: 100,
            }}
          >
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${forecast.item.weather[0].icon}@2x.png`,
              }}
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
          <Text>{forecast.item.weather[0].description}</Text>
        </View>
        <View>
          <Text>{forecast.item.main.temp} °C</Text>
          <Text>{forecast.item.wind.speed} m/s</Text>
        </View>
      </View>
    </View>
  );
}

export default function Forecast() {
  const [city] = useStore((state) => [state.city, state.setCity]);
  const [forecast, setForecast] = useState<Resp>();

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=fi&units=metric&APPID=${API_KEY}`,
    )
      .then((req) => req.json())
      .then((json) => {
        setForecast(json as Resp);
      });
  }, [city]);
  return (
    <FlatList
      data={forecast?.list}
      renderItem={(forecast) => <Item forecast={forecast} />}
      style={{ backgroundColor: "white" }}
    />
  );
}
