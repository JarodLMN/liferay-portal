/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.headless.document.library.internal.resource.v1_0;

import com.liferay.headless.document.library.dto.v1_0.Document;
import com.liferay.headless.document.library.resource.v1_0.DocumentResource;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.search.filter.Filter;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.multipart.MultipartBody;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;
import com.liferay.portal.vulcan.util.TransformUtil;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import javax.annotation.Generated;

import javax.validation.constraints.NotNull;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;

/**
 * @author Javier Gamarra
 * @generated
 */
@Generated("")
@Path("/v1.0")
public abstract class BaseDocumentResourceImpl implements DocumentResource {

	@Override
	@GET
	@Parameters(
		value = {
			@Parameter(in = ParameterIn.QUERY, name = "filter"),
			@Parameter(in = ParameterIn.QUERY, name = "page"),
			@Parameter(in = ParameterIn.QUERY, name = "pageSize"),
			@Parameter(in = ParameterIn.QUERY, name = "sorts")
		}
	)
	@Path("/content-spaces/{content-space-id}/documents")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Page<Document> getContentSpaceDocumentsPage(
			@NotNull @PathParam("content-space-id") Long contentSpaceId,
			@QueryParam("flatten") Boolean flatten,
			@QueryParam("search") String search, @Context Filter filter,
			@Context Pagination pagination, @Context Sort[] sorts)
		throws Exception {

		return Page.of(Collections.emptyList());
	}

	@Override
	@Consumes("multipart/form-data")
	@POST
	@Path("/content-spaces/{content-space-id}/documents")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Document postContentSpaceDocument(
			@NotNull @PathParam("content-space-id") Long contentSpaceId,
			MultipartBody multipartBody)
		throws Exception {

		return new Document();
	}

	@Override
	@DELETE
	@Path("/documents/{document-id}")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public void deleteDocument(
			@NotNull @PathParam("document-id") Long documentId)
		throws Exception {
	}

	@Override
	@GET
	@Path("/documents/{document-id}")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Document getDocument(
			@NotNull @PathParam("document-id") Long documentId)
		throws Exception {

		return new Document();
	}

	@Override
	@Consumes("multipart/form-data")
	@PATCH
	@Path("/documents/{document-id}")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Document patchDocument(
			@NotNull @PathParam("document-id") Long documentId,
			MultipartBody multipartBody)
		throws Exception {

		return new Document();
	}

	@Override
	@Consumes("multipart/form-data")
	@PUT
	@Path("/documents/{document-id}")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Document putDocument(
			@NotNull @PathParam("document-id") Long documentId,
			MultipartBody multipartBody)
		throws Exception {

		return new Document();
	}

	@Override
	@GET
	@Parameters(
		value = {
			@Parameter(in = ParameterIn.QUERY, name = "filter"),
			@Parameter(in = ParameterIn.QUERY, name = "page"),
			@Parameter(in = ParameterIn.QUERY, name = "pageSize"),
			@Parameter(in = ParameterIn.QUERY, name = "sorts")
		}
	)
	@Path("/folders/{folder-id}/documents")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Page<Document> getFolderDocumentsPage(
			@NotNull @PathParam("folder-id") Long folderId,
			@QueryParam("search") String search, @Context Filter filter,
			@Context Pagination pagination, @Context Sort[] sorts)
		throws Exception {

		return Page.of(Collections.emptyList());
	}

	@Override
	@Consumes("multipart/form-data")
	@POST
	@Path("/folders/{folder-id}/documents")
	@Produces("application/json")
	@Tags(value = {@Tag(name = "Document")})
	public Document postFolderDocument(
			@NotNull @PathParam("folder-id") Long folderId,
			MultipartBody multipartBody)
		throws Exception {

		return new Document();
	}

	public void setContextCompany(Company contextCompany) {
		this.contextCompany = contextCompany;
	}

	protected void preparePatch(Document document) {
	}

	protected <T, R> List<R> transform(
		Collection<T> collection,
		UnsafeFunction<T, R, Exception> unsafeFunction) {

		return TransformUtil.transform(collection, unsafeFunction);
	}

	protected <T, R> R[] transform(
		T[] array, UnsafeFunction<T, R, Exception> unsafeFunction,
		Class<?> clazz) {

		return TransformUtil.transform(array, unsafeFunction, clazz);
	}

	protected <T, R> R[] transformToArray(
		Collection<T> collection,
		UnsafeFunction<T, R, Exception> unsafeFunction, Class<?> clazz) {

		return TransformUtil.transformToArray(
			collection, unsafeFunction, clazz);
	}

	protected <T, R> List<R> transformToList(
		T[] array, UnsafeFunction<T, R, Exception> unsafeFunction) {

		return TransformUtil.transformToList(array, unsafeFunction);
	}

	@Context
	protected AcceptLanguage contextAcceptLanguage;

	@Context
	protected Company contextCompany;

	@Context
	protected UriInfo contextUriInfo;

}