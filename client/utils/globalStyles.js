import { StyleSheet } from "react-native";
import React from "react";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  screenHeader: {},
  heading1: {
    fontSize: 25,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 15,
  },
  tile: {
    margin: 10,
    borderWidth: 1,
    borderLeftColor: "dodgerblue",
    borderTopColor: "dodgerblue",
    borderRightColor: "orchid",
    borderBottomColor: "orchid",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10
  },
  button: {
    backgroundColor: "red"
  }
});
