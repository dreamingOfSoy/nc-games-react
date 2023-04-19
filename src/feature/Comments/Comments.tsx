import { useEffect, useState } from 'react';
import { useRequest } from '../../hooks/use-request';
import * as Styled from './styles';

import { Comment } from '../../types/types';
import CommentCard from '../../components/CommentCard/CommentCard';

type Props = {
  reviewId: number;
};

type ResponseT = {
  comments: Array<Comment>;
};

const Comments = ({ reviewId }: Props) => {
  const [comments, setComments] = useState<Array<Comment>>();
  const { sendRequest, isError, isLoading, errorMsg } = useRequest();

  useEffect(() => {
    const res = (data: ResponseT) => {
      setComments(data.comments);
    };

    sendRequest('GET', `/reviews/${reviewId}/comments`, res);
  }, []);

  return (
    <Styled.Comments direction="column">
      {isError && <span>{errorMsg}</span>}

      {isLoading && <span>Loading...</span>}

      {comments &&
        !isLoading &&
        !isError &&
        comments.map((comment, i) => (
          <CommentCard
            key={i}
            author={comment.author}
            body={comment.body}
            date={new Date(comment?.created_at as Date)}
            votes={comment.votes}
          />
        ))}
    </Styled.Comments>
  );
};

export default Comments;
