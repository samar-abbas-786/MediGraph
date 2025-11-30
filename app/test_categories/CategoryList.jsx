const CategoryList = ({ data, onSelectCategory }) => {
  return (
    <div>
      <h2>Select Test Category</h2>

      {data.map((item, i) => (
        <div key={i} style={styles.card} onClick={() => onSelectCategory(item)}>
          {item.category}
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    margin: "8px 0",
  },
};

export default CategoryList;
