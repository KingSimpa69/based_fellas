export const generateRandomImageURLs = (count) => {
    const imagecount = 9999;
    const imageArray = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * imagecount) + 1;
      const imageURL = `${randomIndex}.png`;
      imageArray.push(imageURL);
    }
    return imageArray;
  }