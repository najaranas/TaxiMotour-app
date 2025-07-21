# Border Width Usage Guide

## ✅ Current Border Width Configuration

### Light Mode (Optimized for light backgrounds):

- `none`: 0
- `thin`: **0.5** (very subtle borders)
- `regular`: **1** (standard borders)
- `thick`: **1.5** (emphasis borders)
- `extraThick`: **2** (strong borders)

### Dark Mode (Optimized for dark backgrounds):

- `none`: 0
- `thin`: **1** (more visible borders)
- `regular`: **2** (standard borders)
- `thick`: **3** (emphasis borders)
- `extraThick`: **4** (strong borders)

## 🎯 How to Use in Components

### 1. **In React Components** (Recommended)

Use the theme context to get dynamic border widths:

```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        borderWidth: theme.borderWidth.thin, // 0.5px in light, 1px in dark
        borderColor: theme.input.border,
        borderRadius: theme.borderRadius.medium,
      }}>
      {/* Content */}
    </View>
  );
}
```

### 2. **Common Usage Examples**

#### Input Fields:

```tsx
<TextInput
  style={{
    borderWidth: theme.borderWidth.regular, // 1px in light, 2px in dark
    borderColor: theme.input.border,
    borderRadius: theme.borderRadius.small,
  }}
/>
```

#### Cards with Subtle Borders:

```tsx
<View
  style={{
    borderWidth: theme.borderWidth.thin, // 0.5px in light, 1px in dark
    borderColor: theme.input.border,
    borderRadius: theme.borderRadius.medium,
  }}>
  {/* Card content */}
</View>
```

#### Buttons with Emphasis:

```tsx
<TouchableOpacity
  style={{
    borderWidth: theme.borderWidth.thick, // 1.5px in light, 3px in dark
    borderColor: theme.button.primary,
    borderRadius: theme.borderRadius.pill,
  }}>
  {/* Button content */}
</TouchableOpacity>
```

#### Strong Borders for Important Elements:

```tsx
<View
  style={{
    borderWidth: theme.borderWidth.extraThick, // 2px in light, 4px in dark
    borderColor: theme.status.error,
    borderRadius: theme.borderRadius.medium,
  }}>
  {/* Important content */}
</View>
```

## 🔧 Static Styles (When theme context isn't available)

For StyleSheet objects where you can't use theme context:

```tsx
const styles = StyleSheet.create({
  container: {
    borderWidth: 1, // Use hardcoded values with comments
    borderRadius: 10, // theme.borderRadius.medium equivalent
  },
});
```

## 🎨 Real-World Examples

### Input Component with Focus States:

```tsx
function CustomInput({ focused }: { focused: boolean }) {
  const { theme } = useTheme();

  return (
    <TextInput
      style={{
        borderWidth: focused
          ? theme.borderWidth.thick // Thick when focused
          : theme.borderWidth.regular, // Regular when not focused
        borderColor: focused ? theme.button.primary : theme.input.border,
      }}
    />
  );
}
```

### Card with Different Border Styles:

```tsx
function Card({ variant }: { variant: "subtle" | "normal" | "emphasized" }) {
  const { theme } = useTheme();

  const getBorderWidth = () => {
    switch (variant) {
      case "subtle":
        return theme.borderWidth.thin;
      case "emphasized":
        return theme.borderWidth.thick;
      default:
        return theme.borderWidth.regular;
    }
  };

  return (
    <View
      style={{
        borderWidth: getBorderWidth(),
        borderColor: theme.input.border,
        borderRadius: theme.borderRadius.medium,
      }}>
      {/* Content */}
    </View>
  );
}
```

## 📱 Benefits

✅ **Automatic Adaptation**: Borders automatically adjust for light/dark modes
✅ **Better Visibility**: Dark mode gets thicker borders for better contrast
✅ **Clean Design**: Light mode gets thinner borders for a minimal look
✅ **Type Safety**: Full TypeScript support with IntelliSense
✅ **Consistency**: Same border naming across all components

## 🚀 Migration from Old Code

### Before (Hardcoded):

```tsx
borderWidth: 1,
```

### After (Theme-aware):

```tsx
borderWidth: theme.borderWidth.regular,
```

The theme system will automatically provide:

- **1px** in light mode
- **2px** in dark mode

Perfect visual balance for both themes! 🎉
