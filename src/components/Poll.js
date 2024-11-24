const Poll = ({ poll }) => {
    const [votes, setVotes] = useState(poll.options);

    const handleVote = (index) => {
        const updatedVotes = votes.map((option, i) =>
            i === index ? { ...option, votes: option.votes + 1 } : option
        );
        setVotes(updatedVotes);
    };

    return (
        <div>
            <h4>{poll.question}</h4>
            {votes.map((option, index) => (
                <button key={index} onClick={() => handleVote(index)}>
                    {option.text} ({option.votes} votes)
                </button>
            ))}
        </div>
    );
};

export default Poll;
