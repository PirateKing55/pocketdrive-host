export const addToBin = async (req, res) => {
  try {
    const { user, file } = req.body;

    // Find the index of the file in user's files array
    const index = user.files.findIndex((x) => x.id === file.id);

    // If file is found, mark it as deleted
    if (index !== -1) {
      user.files[index].deleted = true;
      for (let i = 0; i < user.collections.length; i++) {
        if (!user.collections[i]) continue;
        const collection = user.collections[i];
        const fileIndex = collection.files.findIndex((x) => x.id === file.id);
        if (fileIndex !== -1) {
          collection.files[fileIndex].deleted = true;
        }
      }
      await user.save();
      res.json({ message: "Added to Bin" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error adding to Bin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const restoreFromBin = async (req, res) => {
  try {
    const { user, file } = req.body;

    // Find the index of the file in user's files array
    const index = user.files.findIndex((x) => x.id === file.id);

    // If file is found, mark it as deleted
    if (index !== -1) {
      user.files[index].deleted = false;
      for (let i = 0; i < user.collections.length; i++) {
        if (!user.collections[i]) continue;
        const collection = user.collections[i];
        const fileIndex = collection.files.findIndex((x) => x.id === file.id);
        if (fileIndex !== -1) {
          collection.files[fileIndex].deleted = false;
        }
      }
      await user.save();
      res.json({ message: "Restored" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error adding to Bin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const permanentlyDelete = async (req, res) => {
  try {
    const { user, file } = req.body;

    // Find the index of the file in user's files array
    const index = user.files.findIndex((x) => x.id === file.id);

    // If file is found, mark it as deleted
    if (index !== -1) {
      user.files.splice(index, 1);
      for (let i = 0; i < user.collections.length; i++) {
        if (!user.collections[i]) continue;
        const collection = user.collections[i];
        const fileIndex = collection.files.findIndex((x) => x.id === file.id);
        if (fileIndex !== -1) {
          collection.files.splice(fileIndex, 1);
        }
      }
      await user.save();
      res.json({ message: "Deleted" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error adding to Bin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const emptyBin = async (req, res) => {
  try {
    const { user } = req.body;
    user.files = user.files.filter((x) => !x.deleted);
    for (let i = 0; i < user.collections.length; i++) {
      if (!user.collections[i]) continue;
      const collection = user.collections[i];
      collection.files = collection.files.filter((x) => !x.deleted);
    }
    await user.save();
    res.json({ message: "Bin emptied" });
  } catch (error) {
    console.error("Error emptying Bin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const restoreAll = async (req, res) => {
  try {
    const { user } = req.body;
    user.files.forEach((file) => {
      file.deleted = false;
    });
    for (let i = 0; i < user.collections.length; i++) {
      if (!user.collections[i]) continue;
      const collection = user.collections[i];
      collection.files.forEach((file) => {
        file.deleted = false;
      });
    }
    await user.save();
    res.json({ message: "Restored all" });
  } catch (error) {
    console.error("Error restoring all:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
