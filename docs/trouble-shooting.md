# Troubleshooting

### ✅ Full reset

```
watchman watch-del-all
rm -rf node_modules ios/Pods ios/Podfile.lock android/.gradle
rm package-lock.json && npm install
cd ios && pod install && cd ..

```

or

```
watchman watch-del-all && rm -rf node_modules android/.gradle ios/Pods && yarn && cd ios && pod install
```

### ✅ Version check

```
echo "🔹 Node: $(node -v)"; \
echo "🔹 npm: $(npm -v)"; \
echo "🔹 yarn: $(yarn -v 2>/dev/null || echo 'Not installed')"; \
echo "🔹 Java: $(java -version 2>&1 | head -n 1)"; \
echo "🔹 Xcode: $(xcodebuild -version | head -n 1)"; \
echo "🔹 Cocoapods: $(pod --version 2>/dev/null || echo 'Not installed')"; \
echo "🔹 Watchman: $(watchman -v 2>/dev/null || echo 'Not installed')"; \
echo "🔹 React Native CLI: $(npx react-native --version 2>/dev/null || echo 'Not installed')"
```

<br/>

## App Build Issues

### 1. Clean everything first

```
watchman watch-del-all
rm -rf node_modules android/.gradle ios/Pods ios/Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData
rm package-lock.json
npm install
cd ios && pod install && cd ..

```

### 2. Always Build iOS First

```
npx react-native run-ios

```

then

```
npx react-native run-android
```

### 3. Use `--reset-cache` if you switch platforms often

```
npx react-native start --reset-cache
```

Run this before starting another platform's build.

### 4. Safe Build script

```
npm run clean:all && npm run build:ios && npm run build:android
```

or

```
npm run clean:all
```

<br/>

## Switching between Android and iOS builds

### ✅ When switching from **Android → iOS**:

Run:

```bash
cd ios
pod install
cd ..
```

OR just:

```bash
npx pod-install
```

> This ensures native iOS dependencies are synced.

---

### ✅ When switching from **iOS → Android**:

Usually, **no extra command** is needed, unless:

- You've added/removed a native dependency
- You see a build error

Then run:

```bash
cd android
./gradlew clean
cd ..
npm run android or npx react-native run-android
```

Or:

```bash
npx react-native-clean-project
```

> `clean-project` is safer if you frequently switch and want to avoid stale builds:

```bash
npm install -g react-native-clean-project
```

---

### 🔁 TL;DR:

| Direction     | Command Needed                |
| ------------- | ----------------------------- |
| Android → iOS | `npx pod-install`             |
| iOS → Android | `./gradlew clean` (if needed) |
