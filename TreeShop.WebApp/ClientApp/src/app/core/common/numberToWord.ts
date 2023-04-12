const numberFormatValidator = /^\d+$/;
const largeUnitsBase = ['nghìn', 'triệu', 'tỉ'];
// const basicNumberToWord = {
//   "0": 'không',
//   "1": 'một',
//   "2": 'hai',
//   "3": 'ba',
//   "4": 'bốn',
//   "5": 'năm',
//   "6": 'sáu',
//   "7": 'bảy',
//   "8": 'tám',
//   "9": 'chín'
// };
const basicNumberToWord= ["không",'một',"hai", "ba", "bốn","năm","sáu", "bảy", "tám", "chín"]
const HUNDRED_PLACE_INDEX = 0;
const TENS_PLACE_INDEX = 1;
const ONES_PLACE_INDEX = 2;

export default class NumberToWord {
  constructor() {
  }

  static breakIntoGroupOfThree(string:any) {
    let groups = [];
    const remainder = string.length % 3;

    if (string.length > 3 && remainder !== 0) {
      groups.push(string.substr(0, remainder));
      string = string.substr(remainder);
    }
    return groups.concat(string.match(/\d{1,3}/g));
  }

  static mapGroupsToUnits(groups:any) {
    const reversedGroups = groups.slice().reverse();
    let reversedUnits;

    reversedUnits = reversedGroups.map((group:any, index:any) => {
      if (index === 0) {
        return '';
      }
      return largeUnitsBase[(index - 1) % 3];
    });
    return reversedUnits.reverse();
  }

  static translateThreeDigitsNumberToWords(number:any) {
    number = String(number);

    if (number.length > 3 || number.length < 0 || !numberFormatValidator.test(number)) {
      throw TypeError;
    }
    const digitsLength = number.length;

    return number.split('').map((digit:any, numberIndex:any) => {
      let placeIndex = numberIndex;

      if (digitsLength < 3) {
        placeIndex = placeIndex + (3 - digitsLength);
      }
      switch (placeIndex) {
        case HUNDRED_PLACE_INDEX: {
            if(digit==0)
            return '';
          else 
          return basicNumberToWord[digit] + ' trăm';
        }
        case TENS_PLACE_INDEX: {
          if (digit == 0) {
            let nextDigest = number[numberIndex + 1];
            if (nextDigest == 0) {
              return '';
            }

            return 'lẻ';
          }
          if (digit === '1') {
            return 'mười';
          }
          return basicNumberToWord[digit] + ' mươi';
        }
        case ONES_PLACE_INDEX: {
          if (digit === '5' && digitsLength > 1) {
            return 'lăm';
          }
          if (digit === '1' && digitsLength > 1) {
            let nextDigest = number[numberIndex - 1];
              
            if (nextDigest !== '1') {
              return 'mốt';
            }
            if (nextDigest == '1') {
              return 'một';
            }
          }
          if (digit === '0' && digitsLength > 1) {
            return '';
          }
          return basicNumberToWord[digit];
        }
      }
      return null;
    }).filter((n:any) => n !== '').join(' ');
  }

  static mapGroupsToWords(groups:any) {
    return groups.map((number:any, index:number) => {
  
      return this.translateThreeDigitsNumberToWords(number);
    });
  }

  public static getFullText(numberOrString:any) {
    
    let number = String(numberOrString);
    let groups = NumberToWord.breakIntoGroupOfThree(number);
    
    let groupsToUnits = NumberToWord.mapGroupsToUnits(groups);
  
    let groupsToWords = NumberToWord.mapGroupsToWords(groups);

    return groupsToWords.map((word:any, index:any) => {
      if (groupsToUnits[index] === '') {
        return word;
      }
      return word + ' ' + groupsToUnits[index];
    }).join(' ') + " đồng";
  }
}