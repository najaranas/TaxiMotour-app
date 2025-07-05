import THEME from "./theme";

export const userTypes = [
  {
    id: "passenger" as const,
    title: "Passenger",
    subtitle: "Book rides and travel comfortably",
    description: "Request rides, track your driver, and enjoy a safe journey.",
    icon: require("../assets/images/passenger.png"),
    textColor: THEME.text.primary,
  },
  {
    id: "driver" as const,
    title: "Driver",
    subtitle: "Earn money by driving",
    description:
      "Accept ride requests, earn money, and manage your trips easily.",
    icon: require("../assets/images/driver.png"),
    textColor: THEME.text.primary,
  },
];
