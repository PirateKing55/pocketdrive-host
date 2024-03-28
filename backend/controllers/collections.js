export const getAllFiles = (req, res) => {
  const user = req.body.user;
  res.json(user.files);
};

export const getAllCollections = (req, res) => {
  const user = req.body.user;
  res.json(user.collections);
};

export const createCollection = async (req, res) => {
  const { collectionName, user } = req.body;
  if (
    user.collections.some((element) => element.collectionName == collectionName)
  ) {
    return res.status(500).json({ message: "Collection Already Exists" });
  }
  user.collections.push({
    collectionName: collectionName,
    files: [],
  });
  await user.save();
  res.json(user.collections);
};

export const addToCollection = async (req, res) => {
  const { collectionName, user, file } = req.body;
  console.log(collectionName);
  const collections = user.collections;
  collections.forEach((element) => {
    if (element.collectionName == collectionName) {
      element.files.push(file);
    }
  });
  // user.collections = collections
  console.log(user.collections);
  await user.save();
  res.json({ message: "Added Successfully" });
};

export const removeFromCollection = async (req, res) => {
  const { collectionName, user, file } = req.body;
  const collections = user.collections;
  collections.forEach((element) => {
    if (element.collectionName == collectionName) {
      element.files = element.files.filter((x) => x.id != file.id);
    }
  });
  await user.save();
  res.json({ message: "Removed Successfully" });
};

export const handleFavourite = async (req, res) => {
  try {
    const { user, file } = req.body;
    const targetFile = user.files.find((x) => x.id == file.id);
    if (!targetFile) {
      return res.status(404).json({ message: "File not found" });
    }

    targetFile.isFavourite = !targetFile.isFavourite;

    if (targetFile.isFavourite) {
      user.collections.forEach((element) => {
        if (element.collectionName == "Favourites") {
          element.files.push(file);
        }
      });
      user.collections.forEach((collection) => {
        collection.files.forEach((file) => {
          if (file.id == targetFile.id) {
            file.isFavourite = true;
          }
        });
      });
    } else {
      user.collections.forEach((element) => {
        if (element.collectionName == "Favourites") {
          element.files = element.files.filter((x) => x.id != file.id);
        }
      });
      user.collections.forEach((collection) => {
        collection.files.forEach((file) => {
          if (file.id == targetFile.id) {
            file.isFavourite = false;
          }
        });
      });
    }
    await user.save();

    if (targetFile.isFavourite) {
      return res.json({ file: targetFile, message: "Added to Favourites" });
    } else {
      return res.json({ file: targetFile, message: "Removed from Favourites" });
    }
  } catch (error) {
    console.error("Error handling favourite:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeAllFavourites = async (req, res) => {
  try {
    const { user } = req.body;
    user.files.forEach((file) => {
      file.isFavourite = false;
    });
    user.collections.forEach((element) => {
      if (element.collectionName == "Favourites") {
        element.files = [];
      }
    });
    user.collections.forEach((collection) => {
      collection.files.forEach((file) => {
        file.isFavourite = false;
      });
    });
    await user.save();
    res.json({ message: "Removed all favourites" });
  } catch (error) {
    console.error("Error removing all favourites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const renameCollection = async (req, res) => {
  try {
    const { collectionName, user, newName } = req.body;
    const collections = user.collections;
    collections.forEach((element) => {
      if (element.collectionName == collectionName) {
        element.collectionName = newName;
      }
    });
    await user.save();
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    console.error("Error renaming collection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const renameFile = async (req, res) => {
  try {
    const { user, file, newName } = req.body;
    const targetFile = user.files.find((x) => x.id == file.id);
    targetFile.name = newName;
    user.collections.forEach((element) => {
      element.files.forEach((file) => {
        if (file.id == targetFile.id) {
          file.name = newName;
        }
      });
    });
    await user.save();
    res.json({ message: "Renamed Successfully" });
  } catch (error) {
    console.error("Error renaming file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
