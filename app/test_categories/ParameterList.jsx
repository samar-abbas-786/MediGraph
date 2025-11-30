const ParameterList = ({ category, onSelectParameter, onBack }) => {
  return (
    <div>
      <h2>Parameters in: {category.category}</h2>

      {category.parameters.map((param, i) => (
        <div
          key={i}
          style={styles.card}
          onClick={() => onSelectParameter(param)}
        >
          {param}
        </div>
      ))}

      <button onClick={onBack} style={styles.backBtn}>
        Back
      </button>
    </div>
  );
};

const styles = {
  card: {
    cursor: "pointer",
    padding: "10px",
    border: "1px solid #aaa",
    borderRadius: "6px",
    margin: "8px 0",
  },
  backBtn: {
    marginTop: "10px",
    padding: "6px 12px",
  },
};

export default ParameterList;
