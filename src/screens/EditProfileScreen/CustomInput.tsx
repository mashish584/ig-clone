import {Control, Controller} from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';
import styles from './styles';
import {colors} from '../../theme';
import {User} from '../../API';

export type IEditableUser = Partial<
  Pick<User, 'name' | 'username' | 'website' | 'bio' | 'image'>
>;

interface ICustomInput {
  label: string;
  name: keyof IEditableUser;
  control: Control<IEditableUser, object>;
  rules?: object;
  multiline?: boolean;
}

const CustomInput = (props: ICustomInput) => {
  const {label, multiline, name, control, rules} = props;
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value, onBlur}, fieldState: {error}}) => {
        return (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={{flex: 1}}>
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                value={value || ''}
                placeholder={label}
                style={[
                  styles.input,
                  {borderColor: error?.type ? colors.accent : colors.border},
                ]}
                multiline={multiline}
                autoCapitalize="none"
              />
              {error?.type && (
                <Text style={{color: colors.accent}}>
                  {error.message || 'Enter a valid value.'}
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
};

export default CustomInput;
