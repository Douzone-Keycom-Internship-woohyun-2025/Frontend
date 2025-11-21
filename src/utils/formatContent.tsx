export const formatContent = (content: string): React.JSX.Element[] => {
  return content.split("\n").map((line, index) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h4
          key={index}
          className="font-semibold text-gray-900 mt-4 mb-2 first:mt-0"
        >
          {line.replace(/\*\*/g, "")}
        </h4>
      );
    }

    if (line.startsWith("- **")) {
      const parts = line.split("**");
      return (
        <div key={index} className="ml-4 mb-2">
          <span className="font-medium text-gray-900">{parts[1]}</span>
          <span className="text-gray-700">: {parts[2]}</span>
        </div>
      );
    }

    if (line.startsWith("- ")) {
      return (
        <div key={index} className="ml-4 mb-1 text-gray-700">
          {line.substring(2)}
        </div>
      );
    }

    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }

    return (
      <p key={index} className="text-gray-700 mb-2 leading-relaxed">
        {line}
      </p>
    );
  });
};
