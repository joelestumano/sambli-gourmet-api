export class PaginateConfig {
    static paginateCustomLabels() {
        return {
            docs: 'documentos',
            limit: 'limite',
            page: 'pagina',
            nextPage: 'proximaPagina',
            prevPage: 'paginaAnterior',
            totalPages: 'totalPaginas',
            totalDocs: 'totalDocumentos',
            hasPrevPage: false,
            hasNextPage: false,
            pagingCounter: false,
            offset: false,
        };
    }
}