import { useContext, useEffect, useRef, useState } from 'react';
import { useRequest } from '../../hooks/use-request';
import * as Styled from './styles';

import { Comment } from '../../types/types';
import CommentCard from '../../components/CommentCard/CommentCard';
import { Button } from '../../components/Button/styles';
import AuthContext from '../../store/auth-context';

type Props = {
  reviewId: number;
};

type ResponseT = {
  comments: Array<Comment>;
};

type PostResponseT = {
  comment: Array<Comment>;
};

const Comments = ({ reviewId }: Props) => {
  const body = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<Array<Comment>>();
  const [commentPosted, setCommentPosted] = useState(false);
  const { sendRequest, isError, isLoading, errorMsg } = useRequest();

  const authContext = useContext(AuthContext);
  const { isLoggedIn, userDetails } = authContext;

  useEffect(() => {
    const res = (data: ResponseT) => {
      setComments(data.comments);
    };

    sendRequest('GET', `/reviews/${reviewId}/comments`, res);
  }, []);

  const handleDelete = (id: string) => {
    const newState = comments?.filter(comment => comment.comment_id !== +id);
    setComments(newState);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = (data: PostResponseT) => {
      setComments(prevComments => {
        return [...data.comment, ...(prevComments as Comment[])];
      });

      setCommentPosted(true);

      body!.current!.value = '';

      setTimeout(() => {
        setCommentPosted(false);
      }, 10000);
    };

    const reqBody = {
      username: userDetails.username,
      body: body.current?.value,
    };

    sendRequest('POST', `/reviews/${reviewId}/comments`, res, reqBody);
  };

  return (
    <Styled.Comments direction="column">
      {isLoggedIn ? (
        <>
          <h3>Add A Comment</h3>
          <Styled.Form onSubmit={handleSubmit} direction="column" gap={0.8}>
            <label htmlFor="body">Comment:</label>
            <textarea ref={body} id="body"></textarea>

            {isError && <span>{errorMsg}</span>}

            {commentPosted && <p>Comment Posted!</p>}

            {isLoading ? (
              <Button type="button">Posting...</Button>
            ) : (
              <Button type="submit">Add Comment</Button>
            )}
          </Styled.Form>
        </>
      ) : (
        <span>Please sign in to leave a comment</span>
      )}

      {comments && !comments.length && (
        <span>No comments for this reviews yet</span>
      )}

      {isLoading && <span>Loading...</span>}

      {comments &&
        comments.map((comment, i) => (
          <CommentCard
            key={i}
            author={comment.author}
            body={comment.body}
            date={new Date(comment?.created_at as Date)}
            votes={comment.votes}
            comment_id={comment.comment_id}
            handleDelete={handleDelete}
          />
        ))}
    </Styled.Comments>
  );
};

export default Comments;
