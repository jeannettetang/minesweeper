const format = (num) => {
  num = num.toString();
  while (num.length < 3) {
    if (num >= 0) {
      num = "0" + num;
    } else {
      num = num[0] + "0" + num.substring(1); 
    }
  }
  if (num.length > 3) {
    if (num >= 0) {
      num = num.substring(num.length-3);
    } else {
      num = num[0] + num.substring(num.length-2);
    }
  }
  return num;
}

const NumberDisplay = ({ value }) => {
  return (
   <p style={{backgroundColor: 'rgba(0, 0, 0, .8)', color: 'red', fontSize: '1.5rem', margin: '.5rem'}}>{format(value)}</p>
  );
}

export default NumberDisplay;
