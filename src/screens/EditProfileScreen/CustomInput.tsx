import {Control, Controller} from 'react-hook-form';
import {Text, TextInput, View} from 'react-native';
import {User} from '../../models';
import {colors} from '../../theme';
import styles from './styles';

export type IEditableUser = Pick<
  User,
  'name' | 'email' | 'username' | 'bio' | 'website'
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
