// components/ui/icon-symbol.tsx

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

const MAPPING: IconMapping = {
  'house.fill': 'home',
  'book.fill': 'menu-book',
  'checkmark.circle.fill': 'check-circle',
  'chatbubble.fill': 'chat',
  'phone.fill': 'phone',
  'person.fill': 'person',
  'paperplane.fill': 'send',
  'chevron.right': 'chevron-right',
  'chevron.left.forwardslash.chevron.right': 'code',
  'bell.fill': 'notifications',
  'gear': 'settings',
  'lock.fill': 'lock',
  'questionmark.circle.fill': 'help',
};

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}