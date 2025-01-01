/* eslint-disable @typescript-eslint/no-explicit-any */
const updateModel = <T extends object>(
  setModel: React.Dispatch<React.SetStateAction<T>>, // Accept setModel as a parameter
  path: string,
  value: any,
  index?: number // Optional index for array updates
): void => {
  const keys = path.split("."); // Split path to keys
  setModel((prevModel) => {
    if (!prevModel) return prevModel;

    const newModel = { ...prevModel }; // Clone the previous model to preserve immutability
    let current: any = newModel;

    // Traverse the path
    keys.forEach((key, indexKey) => {
      if (indexKey === keys.length - 1) {
        // If it's the last key in the path, set the value
        if (index !== undefined && Array.isArray(current[key])) {
          // If it's an array, update the element at the provided index
          current[key] = current[key].map((item: any, idx: number) =>
            idx === index ? { ...item, ...value } : item
          );
        } else {
          // If it's not an array, set the value directly
          current[key] = value;
        }
      } else {
        // Move deeper into the nested object
        current = current[key];
      }
    });

    return newModel;
  });
};

export default updateModel; 