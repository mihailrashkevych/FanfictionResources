export default function Context() {
  const [json, setJson] = useState(null);

  useEffect(() => {
    fetch("/api/people")
      .then((response) => response.json())
      .then((data) => setJson(data));
  }, []);

  return (
    <TagContext.Provider value={{ json }}>
        
    </TagContext.Provider>
  );
}