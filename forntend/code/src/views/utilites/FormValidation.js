// const Required = value => (value || typeof value ==='Number' ? undefined : 'Required')

const Required = value => value ? undefined : 'Required'

const MaxLength = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined
// const maxLength15 = MaxLength(15)

const MinLength = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined
// const minLength2 = MinLength(2)

const Number = value => value && isNaN(Number(value)) ? 'Must be a Number' : undefined
const MinValue = min => value => value && value < min ? `Must be at least ${min}` : undefined
// const minValue13 = MinValue(13)
const Email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? 'Invalid Email address' : undefined
const TooYoung = value => value && value < 13 ? 'You do not meet the minimum age requirement!' : undefined
const Aol = value => value && /.+@Aol\.com/.test(value) ? 'Really? You still use Aol for your Email?' : undefined
const AlphaNumeric = value => value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only AlphaNumeric characters' : undefined
const PhoneNumber = value => value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone Number, must be 10 digits' : undefined

const GSTIN =value=> value && !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/i.test(value)? 'Enter Valid GSTIN Number' : undefined
const TAN= value=> value && !/^([A-Z]){4}([0-9]){5}([A-Z]){1}?$/i.test(value) ? 'Enter valid TAN Number' : undefined;
const BankAccount=value=> value && !/^\d{9,18}$/i.test(value) ? 'Enter valid bank account Number' : undefined;
const IFSCCode=value=> value && /^[A-Za-z]{4}\d{7}$/i.test(value) ? 'Enter valid IFSC code' :undefined


export{
    PhoneNumber,
    MinLength,
    MaxLength,
    Required,
    Number,
    MinValue,
    Email,
    AlphaNumeric,
    Aol,
    TooYoung,
    GSTIN,
    TAN,
    BankAccount,
    IFSCCode
}