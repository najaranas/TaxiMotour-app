# 🚗 TaxiMotour - Modern Ride Sharing App

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?logo=supabase)](https://supabase.io)

A comprehensive ride-sharing mobile application built with React Native and Expo, connecting passengers with motorcycle taxi drivers across Tunisia. Features real-time ride tracking, secure authentication, and multi-language support.

## 🚀 Features Overview

### 🔐 **Authentication & User Management**

- **Multi-Provider Auth**: Clerk integration with Google, Apple, Facebook OAuth
- **Phone Verification**: SMS-based verification system
- **Role-Based Access**: Separate flows for drivers and passengers
- **Session Management**: Secure token handling and auto-login
- **User Type Selection**: Onboarding flow for new users

### 👤 **Profile Management**

- **Personal Information**: Full name, email, phone editing
- **Profile Photos**: Camera integration with selfie verification
- **Driver Profiles**: Experience years, motorcycle type specifications
- **Multi-language Settings**: Arabic, French, English support
- **Theme Customization**: Light/Dark mode toggle

### 🚗 **Ride System**

- **Real-time Booking**: Instant ride requests with location services
- **Ride Tracking**: Live status updates (pending → accepted → in_progress → completed)
- **Payment Options**: Cash, Card, Mobile Wallet, Bank Transfer
- **Distance & Duration**: Automatic calculation with GPS coordinates
- **Ride History**: Complete transaction history with details
- **User Feedback**: Rating and review system

### 🗺️ **Location & Maps**

- **MapLibre Integration**: Custom map implementation
- **Real-time Tracking**: Live driver and passenger location
- **Route Planning**: Pickup to destination routing
- **Address Lookup**: Geocoding for location selection
- **Geographic Coverage**: Tunisia-focused with local addresses

### 🎨 **User Interface**

- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Adaptive to different screen sizes
- **Custom Components**: Reusable UI elements
- **Loading States**: Skeleton placeholders for better UX
- **Pull-to-Refresh**: Data refresh functionality
- **Navigation**: Tab-based and stack navigation

### 🌐 **Internationalization**

- **Multi-language**: Arabic (RTL), French, English
- **Dynamic Switching**: Runtime language changes
- **Localized Content**: All text elements translated
- **Cultural Adaptation**: Region-specific formats

### 📱 **Core Technologies**

#### Frontend

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation system
- **Expo SDK 53** - Development and build platform

#### Backend & Database

- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security** - Database security policies
- **Real-time Updates** - Live data synchronization

#### Authentication

- **Clerk** - User authentication and management
- **OAuth Integration** - Google, Apple, Facebook sign-in
- **Phone Verification** - SMS-based verification

#### State Management

- **Zustand** - Lightweight state management
- **React Context** - Theme and user data management
- **AsyncStorage** - Local data persistence

## 📊 Project Structure

```
app/
├── (auth)/                 # Authentication screens
│   ├── Login.tsx          # Social & phone login
│   ├── PhoneVerification.tsx
│   └── UserTypeSelection.tsx
├── (tabs)/                # Main app screens
│   ├── Home.tsx          # Dashboard
│   ├── RidesHistory.tsx  # Trip history
│   ├── Profile.tsx       # User profile
│   └── Earnings.tsx      # Driver earnings
├── (profile)/            # Profile management
│   ├── PersonalInfo.tsx
│   ├── EditPersonalInfo.tsx
│   ├── Selfie.tsx
│   └── Languages.tsx
└── (rides)/              # Ride-specific screens

components/
├── common/               # Reusable UI components
│   ├── Button.tsx
│   ├── ScreenWrapper.tsx
│   ├── SkeletonPlaceholder.tsx
│   └── CustomBottomSheet.tsx
├── home/                # Home screen components
├── map/                 # Map-related components
└── Ride/               # Ride management components

types/
├── Types.ts             # TypeScript definitions
├── RideProps.ts         # Ride data structures
└── UserTypes.ts         # User management types
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Expo CLI
- Android Studio (for Android)
- Xcode (for iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/najaranas/TaxiMotour.git
   cd TaxiMotour
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Configure your API keys and database URLs
   ```

4. **Start development server**
   ```bash
   npm start
   ```

### Environment Variables

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 Key Features Implementation

### Authentication Flow

```typescript
// OAuth integration with Clerk
const { startSSOFlow } = useSSO();
const handleGoogleLogin = async () => {
  const { createdSessionId, setActive } = await startSSOFlow({
    strategy: "oauth_google",
  });
  if (createdSessionId && setActive) {
    await setActive({ session: createdSessionId });
  }
};
```

### Real-time Ride Updates

```typescript
// Supabase real-time subscriptions
const supabase = getSupabaseClient(session);
supabase
  .channel("rides")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "rides",
    },
    handleRideUpdate
  )
  .subscribe();
```

### Type-Safe Ride Management

```typescript
export type RideProps = {
  id?: string;
  passenger_id: string;
  driver_id: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lon: number;
  destination_address: string;
  destination_lat: number;
  destination_lon: number;
  ride_fare: number;
  distance: number;
  duration: number;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  payment_method: "cash" | "card" | "mobile_wallet" | "bank_transfer";
  created_at: string;
};
```

## 🏗️ Architecture Highlights

- **Type-Safe Development**: Comprehensive TypeScript implementation
- **Component Architecture**: Reusable, modular component design
- **Real-time Data**: Live updates using Supabase subscriptions
- **Offline Support**: Local storage for critical data
- **Error Handling**: Comprehensive error management system
- **Performance**: Optimized with React Native best practices

## 🎯 Technical Achievements

- ✅ **Cross-platform compatibility** - Single codebase for iOS and Android
- ✅ **Real-time features** - Live ride tracking and status updates
- ✅ **Type safety** - 100% TypeScript coverage
- ✅ **Internationalization** - Multi-language support with RTL
- ✅ **Modern UI/UX** - Contemporary design with accessibility
- ✅ **Secure authentication** - Industry-standard OAuth implementation
- ✅ **Scalable architecture** - Modular, maintainable code structure

## 🚦 Current Status

**Version**: 1.0.0 (In Development)
**Platform**: React Native (iOS/Android)
**Region**: Tunisia
**Languages**: Arabic, French, English

---

_Built with ❤️ using React Native, TypeScript, and modern development practices._
