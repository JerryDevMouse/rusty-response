const lowerFirstLetter = (str: string) => {
  return str[0].toLocaleLowerCase() + str.slice(1);
}

export default lowerFirstLetter