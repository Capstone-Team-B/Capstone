const AlreadyMadearray = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
  'allergies',
  'dietRestrictions',
  'accomodations',
  'otherInfo',
];
// add fields here in string format
const array = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
  'allergies',
  'dietRestrictions',
  'accomodations',
  'otherInfo',
];

const stringArray = array.map((entry) => String(entry));
const makeStateSetting = array
  .map((entry) => {
    return `const [${entry}, set${entry}] = useState('');`;
  })
  .join('\n');

const makeSettingBlankString = array
  .map((entry) => {
    return `set${entry}('')`;
  })
  .join(';\n');

const makeReactElement = array
  .map((entry) => {
    return `
  <label htmlFor="${entry}">${entry}:</label>
  <br />
  <input
  type="text"
  id="${entry}"
  name="${entry}"
  value={${entry}}
  required
  onChange={(e) => set${entry}(e.target.value)}
  />
  <br />
  <br />`;
  })
  .join('\n');

const makeDb = array
  .map((entry) => {
    return `${entry}: {type: Sequelize.STRING, defaultValue: "none"},`;
  })
  .join('\n');

const makeReactNativeElement = array
  .map((entry) => {
    return `
    <TextInput
    style={styles.input}
    placeholder="${entry}"
    value={${entry}}
    onChangeText={set${entry}}
    required={true}
    />`;
  })
  .join('\n');
// console.log(makeStateSetting);
// console.log(makeReactElement);
// console.log(makeDb);
console.log(makeReactNativeElement);
