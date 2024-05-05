const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next)
        .catch((err) => {next(err)}))
    }
}
// function hi return karna h because asyncHandler bass ek wraper h


export { asyncHandler }