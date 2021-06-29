export const isProd = () => process.env.NODE_ENV === 'production';

export const capitalizeSentence = (str: string): string => {
  if (!str) {
    return str;
  }
  const strArr = str.trim().toLowerCase().split(' ');
  const capitalizedWords: string[] = [];
  strArr.forEach((word) => {
    const first = word[0];
    const rest = word.substring(1);
    const res = first.toUpperCase() + rest;
    capitalizedWords.push(res);
  });
  const result = capitalizedWords.join(' ');
  return result;
};
