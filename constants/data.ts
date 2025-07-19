import THEME, { COLORS } from "./theme";
import { User, Globe, Moon, LogOut } from "lucide-react-native";

/**
 * User type selection data for authentication flow
 */
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

/**
 * Profile screen menu items configuration
 * Used to dynamically render menu items with consistent styling and behavior
 */
export const profileMenuItems = [
  {
    id: "personal-info",
    title: "Personal Info",
    icon: User,
    iconColor: THEME.text.primary,
    route: "/screens/Profile/PersonalInfo",
    type: "navigation" as const,
    subtitle: undefined,
    isDanger: false,
  },
  {
    id: "language",
    title: "Language",
    subtitle: "English",
    icon: Globe,
    iconColor: THEME.text.primary,
    type: "action" as const,
    action: "language_settings",
    isDanger: false,
  },
  {
    id: "dark-mode",
    title: "Dark Mode",
    icon: Moon,
    iconColor: THEME.text.primary,
    type: "toggle" as const,
    action: "toggle_dark_mode",
    subtitle: undefined,
    isDanger: false,
  },
  {
    id: "logout",
    title: "Logout",
    icon: LogOut,
    iconColor: COLORS.danger,
    type: "action" as const,
    action: "logout",
    isDanger: true,
    subtitle: undefined,
  },
] as const;
