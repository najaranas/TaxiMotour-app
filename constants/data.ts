import { User, Globe, Moon, LogOut } from "lucide-react-native";

/**
 * User type selection data for authentication flow
 */
export const userTypes = [
  {
    id: "passenger" as const,
    title: "Passenger", // These will be translated in the component
    subtitle: "Book rides and travel comfortably",
    description: "Request rides, track your driver, and enjoy a safe journey.",
    icon: require("../assets/images/passenger.png"),
  },
  {
    id: "driver" as const,
    title: "Driver", // These will be translated in the component
    subtitle: "Earn money by driving",
    description:
      "Accept ride requests, earn money, and manage your trips easily.",
    icon: require("../assets/images/driver.png"),
  },
];

/**
 * Profile screen menu items configuration
 * Used to dynamically render menu items with consistent styling and behavior
 * Note: title and subtitle will be translated in the component using i18n keys
 */
export const profileMenuItems = [
  {
    id: "personal-info",
    title: "profile.personalInfo", // i18n key
    icon: User,
    route: "/(profile)/PersonalInfo",
    type: "navigation" as const,
    subtitle: undefined,
    isDanger: false,
  },
  {
    id: "language",
    title: "profile.language", // i18n key
    subtitle: "profile.english", // i18n key - will be dynamic based on selected language
    icon: Globe,
    type: "action" as const,
    action: "language_settings",
    isDanger: false,
  },
  {
    id: "dark-mode",
    title: "profile.darkMode", // i18n key
    icon: Moon,
    type: "toggle" as const,
    action: "toggle_dark_mode",
    subtitle: undefined,
    isDanger: false,
  },
  {
    id: "logout",
    title: "profile.logout", // i18n key
    icon: LogOut,
    type: "action" as const,
    action: "logout",
    isDanger: true,
    subtitle: undefined,
  },
] as const;
