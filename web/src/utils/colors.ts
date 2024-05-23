export const colors = [
"#E81416",
"#FFA500",
"#FAEB36",
"#79C314",
"#487DE7",
"#4B369D",
"#70369D",
]

export const lighterColors = [
  "#fec5bb",
  "#fcd5ce",
  "#fae1dd",
  "#f8edeb",
  "#e8e8e4",
  "#d8e2dc",
  "#ece4db",
  "#ffe5d9",
  "#ffd7ba",
  "#fec89a"
]

export const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}